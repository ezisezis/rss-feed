import React, { Component, StatelessComponent } from 'react';
import { Button } from 'react-bootstrap';
import firebaseApp from './firebase';
import Parser from 'rss-parser';

import Spinner from './Spinner';

const parser = new Parser({
  customFields: {
    item: ['summary'],
  }
});


type FeedProps = {
  rssFeed: Parser.Output | undefined;
  mostFrequentWords: string[];
  loading: boolean;
  error: boolean;
}


const countOccurrencies = (words: string[]) => words.reduce(function(wordCounts, cur) {
  wordCounts[cur] = (wordCounts[cur] || 0) + 1;
  return wordCounts;
}, {} as Record<string, number>);

const getMostFrequentWords = (items: Parser.Item[] = []) => items.reduce((toCount, item) => {
    // we take only title & summary
    const titleWords = item.title ? item.title.toLowerCase().match(/\b['?-?(\w+)?]+\b/gi) : [];
    const summaryWords = item.summary._.replace(/<\/?[^>]+(>|$)/g, "").toLowerCase().match(/\b['?-?(\w+)?]+\b/gi);
    return toCount.concat(titleWords ? titleWords : [], summaryWords);
  }, [] as string[]);

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
      const mostFrequentWords = getMostFrequentWords(rssFeed.items);
      console.log("YO", mostFrequentWords);
      this.setState({
        rssFeed: rssFeed,
        mostFrequentWords: [],
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
    if (this.state.loading) {
      return <Spinner />;
    }

    return (
      <div className="feed">
        <div className="feed__logout">
          <Button onClick={this.logout}>
            Log out
          </Button>
        </div>
        <div>
          {this.state.rssFeed
            && this.state.rssFeed.items
            && this.state.rssFeed.items.map(item => <FeedItem item={item} key={item.id} />)}
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
