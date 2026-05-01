export interface PowerLog {
  id: string;
  created_at: string;
  main_current: number;
  load_current: number;
  difference: number;
  theft_active: boolean;
}
