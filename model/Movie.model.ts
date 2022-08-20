export interface IMovie {
  id: string;
  name: string;
  addedDate: number;
  watched: boolean;
}

export interface Movie extends IMovie {
  hidden: boolean;
  isBeingUpdated: boolean;
}
