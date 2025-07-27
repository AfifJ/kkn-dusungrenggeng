"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";
import BlockRenderer from "../../admin/(menu)/berita/components/BlockRenderer";
import { getBeritaBySlug } from "../../admin/(menu)/berita/actions";

export default function BeritaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [berita, setBerita] = useState(null);
  const [relatedBerita, setRelatedBerita] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        const foundBerita = await getBeritaBySlug(params.slug);
        
        if (foundBerita) {
          setBerita(foundBerita);
          
          // Fetch related berita
          const relatedQuery = query(
            collection(db, "berita"),
            where("kategori", "==", foundBerita.kategori),
            where("status", "==", "published")
          );
          const relatedSnapshot = await getDocs(relatedQuery);
          const related = relatedSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(b => b.id !== foundBerita.id)
            .slice(0, 3);
          setRelatedBerita(related);
        } else {
          router.push('/berita');
        }
      } catch (error) {
        console.error("Error fetching berita:", error);
        router.push('/berita');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchBerita();
    }
  }, [params.slug, router]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Berita tidak ditemukan
            </h1>
            <Link
              href="/berita"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Kembali ke Berita
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b pt-20 pb-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/berita" className="hover:text-green-600">Berita</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{berita.judul}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {berita.kategori}
                </span>
                <time dateTime={berita.tanggal}>
                  {formatDate(berita.tanggal)}
                </time>
                <span>Oleh {berita.penulis || 'Tim Redaksi'}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {berita.judul}
              </h1>
              
              {berita.ringkasan && (
                <p className="text-lg text-gray-600 leading-relaxed">
                  {berita.ringkasan}
                </p>
              )}
            </header>

            {/* Featured Image */}
            {berita.gambar && (
              <div className="mb-8">
                <Image
                  src={berita.gambar}
                  alt={berita.judul}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <BlockRenderer content={berita.konten} />
            </div>

            {/* Add global styles for rich text content */}
            <style jsx global>{`
              .rich-text-content {
                line-height: 1.6;
                color: #374151;
              }
              
              .rich-text-content * {
                max-width: 100%;
              }
              
              .rich-text-content h1 {
                font-size: 2em;
                font-weight: 700;
                margin-bottom: 0.5em;
                margin-top: 1em;
                color: #1f2937;
              }
              
              .rich-text-content h2 {
                font-size: 1.5em;
                font-weight: 600;
                margin-bottom: 0.5em;
                margin-top: 1em;
                color: #1f2937;
              }
              
              .rich-text-content h3 {
                font-size: 1.25em;
                font-weight: 600;
                margin-bottom: 0.5em;
                margin-top: 1em;
                color: #1f2937;
              }
              
              .rich-text-content p {
                margin-bottom: 1em;
                line-height: 1.7;
                word-wrap: break-word;
              }
              
              .rich-text-content ul {
                list-style-type: disc;
                list-style-position: outside;
                margin-bottom: 1em;
                padding-left: 1.5em;
                margin-left: 0;
              }
              
              .rich-text-content ol {
                list-style-type: decimal;
                list-style-position: outside;
                margin-bottom: 1em;
                padding-left: 1.5em;
                margin-left: 0;
              }
              
              .rich-text-content li {
                margin-bottom: 0.5em;
                padding-left: 0.25em;
                line-height: 1.6;
                word-wrap: break-word;
              }
              
              .rich-text-content ul ul {
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                list-style-type: circle;
              }
              
              .rich-text-content ol ol {
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                list-style-type: lower-alpha;
              }
              
              .rich-text-content ul ol {
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                list-style-type: decimal;
              }
              
              .rich-text-content ol ul {
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                list-style-type: disc;
              }
              
              .rich-text-content blockquote {
                border-left: 4px solid #e5e7eb;
                padding-left: 1em;
                margin: 1em 0;
                font-style: italic;
                color: #6b7280;
                background-color: #f9fafb;
                padding: 1em;
                border-radius: 4px;
              }
              
              .rich-text-content img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 1em 0;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                display: block;
              }
              
              .rich-text-content iframe {
                max-width: 100%;
                height: 400px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                margin: 1em 0;
                display: block;
              }
              
              .rich-text-content a {
                color: #059669;
                text-decoration: underline;
                word-wrap: break-word;
              }
              
              .rich-text-content a:hover {
                color: #047857;
              }
              
              .rich-text-content strong {
                font-weight: 600;
              }
              
              .rich-text-content em {
                font-style: italic;
              }
              
              .rich-text-content code {
                background-color: #f3f4f6;
                padding: 0.2em 0.4em;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                word-wrap: break-word;
              }
              
              .rich-text-content pre {
                background-color: #f3f4f6;
                padding: 1em;
                border-radius: 8px;
                overflow-x: auto;
                margin: 1em 0;
                word-wrap: break-word;
              }
              
              .rich-text-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 1em 0;
                overflow-x: auto;
                display: block;
                white-space: nowrap;
              }
              
              .rich-text-content th, .rich-text-content td {
                border: 1px solid #e5e7eb;
                padding: 0.5em;
                text-align: left;
                word-wrap: break-word;
              }
              
              .rich-text-content th {
                background-color: #f9fafb;
                font-weight: 600;
              }
              
              /* Override any conflicting prose styles */
              .prose .rich-text-content ul {
                list-style-type: disc !important;
                list-style-position: outside !important;
                margin-left: 0 !important;
                padding-left: 1.5em !important;
              }
              
              .prose .rich-text-content ol {
                list-style-type: decimal !important;
                list-style-position: outside !important;
                margin-left: 0 !important;
                padding-left: 1.5em !important;
              }
              
              .prose .rich-text-content li {
                margin-top: 0 !important;
                margin-bottom: 0.5em !important;
                padding-left: 0.25em !important;
              }
            `}</style>

            {/* Tags */}
            {berita.tags && berita.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {berita.tags.map((tag, index) => (
                    <span
                      key={`tag-${tag}-${index}`}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedBerita.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Berita Terkait
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBerita.map((item, index) => (
                  <article
                    key={item.id || `related-${index}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Image
                      src={item.gambar || "/images/default-berita.jpg"}
                      alt={item.judul}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="text-xs text-green-600 font-semibold mb-2">
                        {item.kategori}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.ringkasan}
                      </p>
                      <Link
                        href={`/berita/${item.slug || generateSlug(item.judul)}`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Baca selengkapnya →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
