import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const member = await prisma.member.findUnique({
    where: { id },
    include: { boyGroup: true },
  });

  if (!member) notFound();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {member.photoUrl ? (
        <Image src={member.photoUrl} alt={member.stageName} width={300} height={300} className="rounded-lg object-cover" />
      ) : (
        <div className="w-full aspect-square max-w-xs bg-gray-800 rounded-lg" />
      )}

      <h1 className="text-3xl font-bold text-white mt-4">{member.stageName}</h1>
      <p className="text-gray-400">{member.realName} · {member.position}</p>
      <Link href={`/boygroups/${member.boyGroup.id}`} className="text-[#39FF14] text-sm">
        {member.boyGroup.name}
      </Link>

      <div className="mt-4 space-y-2 text-gray-300">
        <p><span className="text-gray-500">Lahir:</span> {member.birthDate.toLocaleDateString("id-ID")}</p>
        {member.favoriteFood && <p><span className="text-gray-500">Makanan favorit:</span> {member.favoriteFood}</p>}
        {member.funFact && <p><span className="text-gray-500">Fun fact:</span> {member.funFact}</p>}
      </div>
    </div>
  );
}