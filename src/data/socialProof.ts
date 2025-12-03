export interface SocialComment {
  id: string;
  username: string;
  platform: 'reddit' | 'twitter' | 'discord';
  text: string;
  timestamp: string;
  upvotes?: number;
  sentiment: 'positive' | 'neutral' | 'excited';
}

export const socialComments: SocialComment[] = [
  {
    id: '1',
    username: 'constantreduction8169',
    platform: 'reddit',
    text: 'real talk bro the amount of traps today is unreal so true',
    timestamp: '49m',
    upvotes: 3,
    sentiment: 'positive'
  },
  {
    id: '2',
    username: 'unhappyproperty1',
    platform: 'reddit',
    text: 'tbh todays find was actually wholesome for once wild',
    timestamp: '4h',
    upvotes: 1,
    sentiment: 'excited'
  },
  {
    id: '3',
    username: 'dampcherry2',
    platform: 'reddit',
    text: 'no cap saw something today that wasnt built to trap ppl for once interesting',
    timestamp: '4h',
    upvotes: 1,
    sentiment: 'positive'
  },
  {
    id: '4',
    username: 'dampcherry2',
    platform: 'reddit',
    text: 'ngl crazy that a clean launchpad exists and no ones yelling about it fr',
    timestamp: '4h',
    upvotes: 1,
    sentiment: 'excited'
  },
  {
    id: '5',
    username: 'unhappyproperty1',
    platform: 'reddit',
    text: 'attenzione, uno scorrimento oggi ha cambiato il mio intero umore, ho notato',
    timestamp: '4h',
    upvotes: 0,
    sentiment: 'positive'
  },
  {
    id: '6',
    username: 'fumblingtrowel2',
    platform: 'reddit',
    text: 'noticed something today that made me rethink where i ape checked',
    timestamp: '15h',
    upvotes: 1,
    sentiment: 'positive'
  },
  {
    id: '7',
    username: 'corrupttub7',
    platform: 'reddit',
    text: 'one scroll today changed my whole mood so true',
    timestamp: '1d',
    upvotes: 1,
    sentiment: 'excited'
  },
  {
    id: '8',
    username: 'naturalatom7',
    platform: 'reddit',
    text: 'yo holders winning rn trust',
    timestamp: '1d',
    upvotes: 0,
    sentiment: 'excited'
  }
];

export const platformColors = {
  reddit: 'hsl(16, 100%, 50%)',
  twitter: 'hsl(203, 89%, 53%)',
  discord: 'hsl(235, 86%, 65%)',
} as const;
