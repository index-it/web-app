export type IxList = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  archived: boolean;
  public: boolean;
  created_at: number;
  edited_at?: number;
  viewers: string[];
  editors: string[];
}