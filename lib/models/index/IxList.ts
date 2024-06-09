export type IxList = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  public: boolean;
  created_at: number;
  edited_at?: number;
  viewers: string[];
  editors: string[];
}