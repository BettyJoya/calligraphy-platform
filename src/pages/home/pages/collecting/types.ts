export interface CollectLetterInfo {
  id: string;
  title: string;
  pic: string;
}
export interface CollectingCardInfo {
  id: string;
  title: string;
  letters: CollectLetterInfo[];
}

export interface CollectDetail {
  id: string;
  title: string;
  letters: CollectLetterInfo[];
}
