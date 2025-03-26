export default function Footer() {
  return (
    <footer className="text-center py-4 bg-gray-200 fixed bottom-0 w-full">
      <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
    </footer>
  );
}
