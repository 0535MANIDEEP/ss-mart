

// AdminLayout: Uses the main app layout's header, sidebar, and footer. No duplication.
// All admin pages will use the unified layout and navigation.
export default function AdminLayout({ children }) {
  return (
    <>{children}</>
  );
}
