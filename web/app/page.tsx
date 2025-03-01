import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ProjectExamples } from "@/components/project-examples";
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/board');
  
  // This code will not run due to the redirect above, but is necessary
  // for TypeScript to understand the return type
  return null;
}
