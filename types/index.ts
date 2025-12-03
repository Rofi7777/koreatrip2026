export interface ItineraryItem {
  id: number | string;
  day_number: number;
  date?: string | null; // YYYY-MM-DD format
  start_time: string; // e.g. "09:00"
  end_time?: string | null;
  title: string;
  description?: string | null;
  // Multilingual fields (optional depending on migration)
  title_vi?: string | null;
  title_en?: string | null;
  title_zh?: string | null;
  description_vi?: string | null;
  description_en?: string | null;
  description_zh?: string | null;
  location?: string | null;
  category?: "flight" | "transport" | "food" | "hotel" | "activity" | string | null;
  owner?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: number | string;
  title: string;
  description?: string | null;
  assignee?: string | null;
  icon?: string | null;
  // Multilingual fields
  title_vi?: string | null;
  title_en?: string | null;
  title_zh?: string | null;
  description_vi?: string | null;
  description_en?: string | null;
  description_zh?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface InfoCard {
  id: number | string;
  title: string;
  content?: string | null;
  icon?: string | null;
  // Multilingual fields
  title_vi?: string | null;
  title_en?: string | null;
  title_zh?: string | null;
  content_vi?: string | null;
  content_en?: string | null;
  content_zh?: string | null;
  created_at?: string;
  updated_at?: string;
}


