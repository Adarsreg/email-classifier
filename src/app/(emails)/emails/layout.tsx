import SignOutButton from "@/components/SignOutButton";
import fetchEmails from "@/components/fetchEmails";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image"
import { notFound } from "next/navigation";
import Button from "@/components/ui/button";
import Selection from "@/components/selection";
import EmailList from "@/components/emailList";
import fetchEmailLimit from "@/helpers/fetchlimit";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const access_token = session.user.sessToken;
  const finals = await fetchEmails(access_token);

  const emails = finals.slice(0,await fetchEmailLimit());
  //Sort emails to make unread emails come first
  emails.sort((a, b) => {
      const aUnread = a.labelIds.includes('UNREAD');
      const bUnread = b.labelIds.includes('UNREAD');
      if (aUnread && !bUnread) return -1;
      if (!aUnread && bUnread) return 1;
      return 0;
  });

  return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-gray-100">
        <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 bg-gray-700 rounded-full overflow-hidden">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={session.user.image || ''}
                  alt="Your profile picture"
                />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {session.user.name}
                </div>
                <div className="text-sm text-gray-400">
                  {session.user.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Selection />
              <Button variant="custom" size="lg">
  Classify
</Button>
              <SignOutButton className="h-full aspect-square" />
            </div>
          </div>
          <EmailList emails={emails} />
        </div>
      </div>
    );
      
};

export default Layout;

