/*
  # Create IT Support Tickets Table

  1. New Tables
    - `it_support_tickets`
      - `id` (uuid, primary key)
      - `name` (text, user's full name)
      - `email` (text, user's email address)
      - `issue` (text, description of the issue)
      - `submitted_at` (timestamp, when ticket was created)

  2. Security
    - Enable RLS on `it_support_tickets` table
    - Add policy for anyone to insert tickets (for login issues)
    - Add policy for authenticated users to read their own tickets
*/

CREATE TABLE IF NOT EXISTS it_support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  issue text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE it_support_tickets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit support tickets (for login issues)
CREATE POLICY "Anyone can submit support tickets"
  ON it_support_tickets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to read their own tickets
CREATE POLICY "Users can read own tickets"
  ON it_support_tickets
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- Allow IT admins to read all tickets
CREATE POLICY "IT admins can read all tickets"
  ON it_support_tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data ->> 'role' = 'it_admin'
    )
  );