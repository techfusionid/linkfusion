import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to editor for now
  // TODO: Add landing page later
  redirect('/editor');
}
