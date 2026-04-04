
import { ReactNode } from "react";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
// import { redirect } from "next/navigation";

// import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  // const isUserAuthenticated = await isAuthenticated();
  // if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div >
      <ParticlesBackground/>
   
     

      {children}
    </div>
  );
};

export default Layout;