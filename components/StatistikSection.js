import { Factory, Users, Sprout } from "lucide-react";

export default function StatistikSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="mb-3 text-center text-3xl font-bold text-green-800 md:text-4xl">
          Jelajahi Grenggeng
        </h2>
        <div className="mx-auto mb-6 h-1 w-20 bg-green-600"></div>

        <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-gray-600">
          Grenggeng adalah sebuah dusun yang terletak di Candimulyo,
          Sidomulyo, Magelang, Jawa Tengah. Dusun ini dikenal sebagai sentra
          produksi tahu berkualitas dan hasil pertanian yang melimpah dengan
          keindahan alam pedesaan yang asri dan mempesona.
        </p>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {/* Statistik 1 */}
          <div className="bg-opacity-10 border-opacity-20 rounded-lg border border-white bg-green-700 p-8 text-center text-white backdrop-blur-sm backdrop-filter">
            <div className="mb-3 text-5xl font-bold">25</div>
            <div className="text-xl">Pengusaha Tahu</div>
            <div className="mt-4">
              <Factory className="mx-auto h-12 w-12 text-green-200" />
            </div>
          </div>

          {/* Statistik 2 */}
          <div className="bg-opacity-10 border-opacity-20 rounded-lg border border-white bg-green-700 p-8 text-center text-white backdrop-blur-sm backdrop-filter">
            <div className="mb-3 text-5xl font-bold">4</div>
            <div className="text-xl">RT</div>
            <div className="mt-4">
              <Users className="mx-auto h-12 w-12 text-green-200" />
            </div>
          </div>

          {/* Statistik 3 */}
          <div className="bg-opacity-10 border-opacity-20 rounded-lg border border-white bg-green-700 p-8 text-center text-white backdrop-blur-sm backdrop-filter">
            <div className="mb-3 text-5xl font-bold">40+</div>
            <div className="text-xl">Petani</div>
            <div className="mt-4">
              <Sprout className="mx-auto h-12 w-12 text-green-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
