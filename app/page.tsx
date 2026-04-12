import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        {/*Hero section*/}
        <section className="container mx-auto px-4 py-32">
          <div >
            <h1 className="text-black">A better way to track your job applications.</h1>
            <p className="text-muted-foreground">
              Keep track of all your job applications in one place.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
