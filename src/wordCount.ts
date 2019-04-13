import Parser from 'rss-parser';

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

/**
 * Extracts words from RSS feed items by taking title and summary. All words are
 * lowercased and must consist of a letters, dashes and apostrophes. Returns a list
 * of all words
 * @param items - entries from RSS feed
 */
const getListOfAllWords = (items: Parser.Item[] = []) => items.reduce((toCount, item) => {
        const regexMatcher = /\b['?-?(A-Za-z+)?]+\b/gi;
        // we take only title & summary
        const titleWords = item.title ? item.title.toLowerCase().match(regexMatcher) : [];
        const summaryWords = item.summary._.replace(/<\/?[^>]+(>|$)/g, "").toLowerCase().match(regexMatcher);
        return toCount.concat(titleWords ? titleWords : [], summaryWords);
    }, [] as string[]);

/**
 * Counts how many times each word is met in an array and returns a Record of words and times it's been found
 * @param words - list of words
 */
const countOccurrencies = (words: string[]) => words.reduce(function(wordCounts, cur) {
        wordCounts[cur] = (wordCounts[cur] || 0) + 1;
        return wordCounts;
    }, {} as Record<string, number>);

/**
 * Filters out the most common words from a Record of word counts
 * @param wordCount - a Record of words and times it's been found
 */
const filterOutMostCommonWords = (wordCount: Record<string, number>) => {
    for (const commonWord of mostCommonWordsInEnglish) {
        if (commonWord in wordCount) {
        delete wordCount[commonWord];
        }
    }
    return wordCount;
}

/**
 * Returns a 2D array that has most occurring words on top
 * @param wordCount - a Record of words and times it's been found
 */
const sortDescendingly = (wordCount: Record<string, number>) => {
    let wordCountMap: Array<[string, number]> = [];
    for (const word in wordCount) {
        wordCountMap.push([word, wordCount[word]]);
    };

    return wordCountMap.sort((a, b) => {
        return b[1] - a[1];
    });
};

/**
 * Counts words in RSS feed and returns a sorted 2D array of word usage
 * @param items - entries from RSS feed
 */
export const getMostFrequentWords = (items: Parser.Item[] = []) => 
    sortDescendingly(filterOutMostCommonWords(countOccurrencies(getListOfAllWords(items))));