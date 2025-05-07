// This is optional but recommended for consistent layout
// app/user/[username]/layout.tsx

export default function UserLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="user-profile-layout">
        {children}
      </div>
    );
  }