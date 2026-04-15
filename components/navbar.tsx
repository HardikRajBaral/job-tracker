import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="continer mx-auto flex h-16 items-center px-4">
        <Link href='/' className="flex item-center gap-2 text-xl font-semibold text-primary">
          <Briefcase />
          Job Tracker
        </Link>
      </div>
    </nav>
  );
}