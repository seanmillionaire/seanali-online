export type SuccessQuote = {
  id: string;
  field: string;
  quote: string;
  person: string;
  sourceLabel: string;
  sourceUrl: string;
};

export const successQuotes: SuccessQuote[] = [
  {
    id: "mandela",
    field: "Purpose · Leadership",
    quote: "Everyone can rise above their circumstances and achieve success if they are dedicated to and passionate about what they do.",
    person: "Nelson Mandela",
    sourceLabel: "Nelson Mandela Foundation",
    sourceUrl: "https://www.nelsonmandela.org/selected-quotes",
  },
  {
    id: "jobs",
    field: "Creation · Vision",
    quote: "You can’t connect the dots looking forward. You can only connect them looking backwards.",
    person: "Steve Jobs",
    sourceLabel: "Stanford commencement address",
    sourceUrl: "https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says",
  },
  {
    id: "ali",
    field: "Courage · Self-belief",
    quote: "I know where I’m going and I know the truth, and I don’t have to be what you want me to be.",
    person: "Muhammad Ali",
    sourceLabel: "Muhammad Ali Center",
    sourceUrl: "https://alicenter.org/meet-ali/in-his-own-words/",
  },
  {
    id: "roosevelt",
    field: "Action · Resilience",
    quote: "It is not the critic who counts.",
    person: "Theodore Roosevelt",
    sourceLabel: "Citizenship in a Republic, 1910",
    sourceUrl: "https://www.presidency.ucsb.edu/documents/address-the-sorbonne-paris-france-citizenship-republic",
  },
];

export const dailyPracticeTips = [
  "Read my Friday result before I open my work.",
  "Make one useful move before I check messages.",
  "Write down what moved before I end the day.",
];
