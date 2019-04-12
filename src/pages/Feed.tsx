import React, { Component, StatelessComponent } from 'react';
import { Button } from 'react-bootstrap';
import Parser from 'rss-parser';

import firebaseApp from '../firebase';
import Spinner from '../components/Spinner';
import Header from '../components/Header';

const parser = new Parser({
  customFields: {
    item: ['summary'],
  }
});

type FeedProps = {
  rssFeed: Parser.Output | undefined;
  mostFrequentWords: Array<[string, number]>;
  loading: boolean;
  error: boolean;
}

const mostCommonWordsInEnglish = [
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
  "that",
  "have",
  "i",
  "it",
  "for",
  "not",
  "on",
  "with",
  "he",
  "as",
  "you",
  "do",
  "at",
  "this",
  "but",
  "his",
  "by",
  "from",
  "they",
  "we",
  "say",
  "her",
  "she",
  "or",
  "an",
  "will",
  "my",
  "one",
  "all",
  "would",
  "there",
  "their",
  "what",
  "so",
  "up",
  "out",
  "if",
  "about",
  "who",
  "get",
  "which",
  "go",
  "me"
];


const getMostFrequentWords = (items: Parser.Item[] = []) => items.reduce((toCount, item) => {
    // we take only title & summary
    const titleWords = item.title ? item.title.toLowerCase().match(/\b['?-?(\w+)?]+\b/gi) : [];
    const summaryWords = item.summary._.replace(/<\/?[^>]+(>|$)/g, "").toLowerCase().match(/\b['?-?(\w+)?]+\b/gi);
    return toCount.concat(titleWords ? titleWords : [], summaryWords);
  }, [] as string[]);

const countOccurrencies = (words: string[]) => words.reduce(function(wordCounts, cur) {
    wordCounts[cur] = (wordCounts[cur] || 0) + 1;
    return wordCounts;
  }, {} as Record<string, number>);

const filterOutMostCommonWords = (wordCount: Record<string, number>) => {
  for (const commonWord of mostCommonWordsInEnglish) {
    if (commonWord in wordCount) {
      delete wordCount[commonWord];
    }
  }
  return wordCount;
}

const sortDescendingly = (wordCount: Record<string, number>) => {
  let wordCountMap: Array<[string, number]> = [];
  for (const word in wordCount) {
    wordCountMap.push([word, wordCount[word]]);
  };

  return wordCountMap.sort((a, b) => {
    return b[1] - a[1];
  });
};

class Feed extends Component<{}, FeedProps> {
  constructor(props: {}) {
    super(props);
    
    this.state = {
      rssFeed: undefined,
      mostFrequentWords: [],
      loading: true,
      error: false,
    }
  }
  componentDidMount = async () => {
    try {
      const rssFeed = await parser.parseURL('https://cors-anywhere.herokuapp.com/https://www.theregister.co.uk/software/headlines.atom');
      const mostFrequentWords = sortDescendingly(filterOutMostCommonWords(countOccurrencies(getMostFrequentWords(rssFeed.items))));

      this.setState({
        rssFeed: rssFeed,
        mostFrequentWords: mostFrequentWords.slice(0, 10),
        loading: false,
        error: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: true,
      });
    }
  }

  logout = async () => {
    try {
      await firebaseApp.auth().signOut();
    } catch (error) {
      alert('Error logging out: ' + error);
    }
  };

  render() {
    const {
      loading,
      mostFrequentWords,
      rssFeed,
    } = this.state;
    if (loading) {
      return <Spinner />;
    }

    return (
      <div className="feed">
        <div className="feed__logout">
          <Button onClick={this.logout}>
            Log out
          </Button>
        </div>
        <Header />
        <div className="feed__frequent-words">
          <h4>Most frequent words in these articles: </h4>
          <ul>
            {mostFrequentWords.map(word => <li key={word[0]}><b>{word[0]}</b>: showed up <b>{word[1]}</b> times</li>)}
          </ul>
        </div>
        <div>
          {rssFeed
            && rssFeed.items
            && rssFeed.items.map(item => <FeedItem item={item} key={item.id} />)}
        </div>
      </div>
    );
  }
}

type FeedItemProps = {
  item: Parser.Item;
}

const FeedItem: StatelessComponent<FeedItemProps> = ({ item }) => (
  <div className="feed__item">
    <h3>{item.author}</h3>
    <a href={item.link} target="_blank"><h2>{item.title}</h2></a>
    <div dangerouslySetInnerHTML={{__html: item.summary._}} />
  </div>
);
export default Feed;
