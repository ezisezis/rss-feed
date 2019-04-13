import React, { StatelessComponent } from 'react';
import Parser from 'rss-parser';

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

export default FeedItem