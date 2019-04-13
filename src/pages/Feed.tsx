import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Parser from 'rss-parser';

import firebaseApp from '../firebase';
import Spinner from '../components/Spinner';
import Header from '../components/Header';
import FeedItem from '../components/FeedItem';
import Error from '../components/Error';
import { getMostFrequentWords } from '../wordCount';

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
      const rssFeed = await parser.parseURL(
        'https://cors-anywhere.herokuapp.com/https://www.theregister.co.uk/software/headlines.atom');
      const mostFrequentWords = getMostFrequentWords(rssFeed.items);

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
      this.setState({
        error: true,
      });
    }
  };

  render() {
    const {
      loading,
      mostFrequentWords,
      rssFeed,
      error,
    } = this.state;

    if (loading) {
      return <Spinner />;
    }
  
    if (error) {
      return <Error />;
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

export default Feed;
