import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BoyGroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const boyGroup = await prisma.boyGroup.findUnique({
    where: { id },
    include: { members: { orderBy: { stageName: "asc" } } },
  });

  if (!boyGroup) notFound();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex gap-6 mb-8">
        {boyGroup.logoUrl ? (
          <Image src={boyGroup.logoUrl} alt={boyGroup.name} width={160} height={160} className="rounded-lg object-cover" />
        ) : (
          <div className="w-40 h-40 bg-gray-800 rounded-lg" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-white">{boyGroup.name}</h1>
          <p className="text-gray-400">{boyGroup.agency} · Debut {boyGroup.debutYear}</p>
          {boyGroup.description && <p className="text-gray-300 mt-3 max-w-xl">{boyGroup.description}</p>}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Members</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {boyGroup.members.map((m) => (
          <Link
            key={m.id}
            href={`/members/${m.id}`}
            className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-[0_0_15px_#39FF14] transition-shadow"
          >
            {m.photoUrl ? (
              <Image src={m.photoUrl} alt={m.stageName} width={200} height={200} className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square bg-gray-800" />
            )}
            <div className="p-3">
              <p className="text-white font-semibold">{m.stageName}</p>
              <p className="text-sm text-gray-400">{m.position}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}