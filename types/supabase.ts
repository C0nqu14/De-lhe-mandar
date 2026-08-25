export type MissionPaymentMethod = 'REFERENCE' | 'MULTICAIXA_EXPRESS';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          role: 'CLIENT' | 'EXECUTOR';
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          display_name: string;
          role: 'CLIENT' | 'EXECUTOR';
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          role?: 'CLIENT' | 'EXECUTOR';
          avatar_url?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
      };
      missions: {
        Row: {
          id: string;
          client_id: string;
          executor_id: string | null;
          title: string;
          description: string;
          service_amount: number;
          purchase_amount: number;
          total_amount: number;
          scheduled_at: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          executor_id?: string | null;
          title: string;
          description: string;
          service_amount: number;
          purchase_amount: number;
          total_amount: number;
          scheduled_at: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          executor_id?: string | null;
          title?: string;
          description?: string;
          service_amount?: number;
          purchase_amount?: number;
          total_amount?: number;
          scheduled_at?: string;
          status?: string;
          updated_at?: string;
        };
      };
      mission_checkpoints: {
        Row: {
          id: string;
          mission_id: string;
          status: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          status: string;
          description: string;
          created_at?: string;
        };
      };
      mission_locations: {
        Row: {
          id: string;
          mission_id: string;
          latitude: number;
          longitude: number;
          address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          latitude: number;
          longitude: number;
          address?: string | null;
          created_at?: string;
        };
      };
      mission_executor_locations: {
        Row: {
          id: string;
          mission_id: string;
          executor_id: string;
          latitude: number;
          longitude: number;
          accuracy: number | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          executor_id: string;
          latitude: number;
          longitude: number;
          accuracy?: number | null;
          updated_at?: string;
        };
      };
      mission_confirmations: {
        Row: {
          id: string;
          mission_id: string;
          confirmation_token: string;
          otp: string;
          confirmed_at: string | null;
          expires_at: string;
          used: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          confirmation_token: string;
          otp: string;
          confirmed_at?: string | null;
          expires_at: string;
          used?: boolean;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          mission_id: string;
          amount: number;
          method: MissionPaymentMethod;
          reference: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          amount: number;
          method: MissionPaymentMethod;
          reference: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ratings: {
        Row: {
          id: string;
          mission_id: string;
          from_user_id: string;
          to_user_id: string;
          score: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          from_user_id: string;
          to_user_id: string;
          score: number;
          comment?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
