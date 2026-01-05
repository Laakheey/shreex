// import { useEffect, useRef } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { useSupabase } from "./providers/SupabaseProvider";

// const UserProfileSync: React.FC = () => {
//   const { user, isLoaded } = useUser();
//   const supabase = useSupabase();
//   const hasRun = useRef(false);

//   useEffect(() => {
//     if (!isLoaded || !user || !supabase || hasRun.current) return;

//     const syncUser = async () => {
//       const email = user.primaryEmailAddress?.emailAddress;
//       if (!email) return;

//       const { data: existingUser } = await supabase
//         .from("users")
//         .select("*")
//         .eq("email", email)
//         .maybeSingle();

//       if (existingUser) {
//         await supabase
//           .from("users")
//           .update({
//             id: user.id,
//             first_name: user.firstName,
//             last_name: user.lastName,
//           })
//           .eq("email", email);

//         console.log("Updated existing user with new Clerk ID");
//       } else {
//         await supabase.from("users").insert({
//           id: user.id,
//           email,
//           first_name: user.firstName,
//           last_name: user.lastName,
//           token_balance: 0,
//           referral_code: Math.random()
//             .toString(36)
//             .substring(2, 8)
//             .toUpperCase(),
//         });
//       }

//       hasRun.current = true;
//     };

//     syncUser();
//   }, [user, isLoaded, supabase]);

//   return null;
// };

// export default UserProfileSync;

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "./providers/SupabaseProvider";

const UserProfileSync: React.FC = () => {
  const { user, isLoaded } = useUser();
  const supabase = useSupabase();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || !supabase || hasRun.current) return;

    const syncUser = async () => {
      // Wait until email is definitely loaded (especially for Google sign-in)
      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.log("Email not loaded yet, retrying in 1 second...");
        setTimeout(syncUser, 1000);  // Retry after 1 second
        return;
      }

      try {
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (existingUser) {
          // MERGE: Update old row with new production Clerk ID
          const { error } = await supabase
            .from("users")
            .update({
              id: user.id,
              first_name: user.firstName || existingUser.first_name,
              last_name: user.lastName || existingUser.last_name,
            })
            .eq("email", email);

          if (error) throw error;
          console.log("Merged! Old user updated to new Clerk ID:", user.id);
        } else {
          // Truly new user
          const { error } = await supabase.from("users").insert({
            id: user.id,
            email,
            first_name: user.firstName,
            last_name: user.lastName,
            token_balance: 0,
            referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          });
          if (error) throw error;
          console.log("Created new user");
        }

        hasRun.current = true;
      } catch (error: any) {
        console.error("Sync failed:", error.message);
      }
    };

    syncUser();
  }, [user, isLoaded, supabase]);

  return null;
};

export default UserProfileSync;



  // useEffect(() => {
  //   if (!isLoaded || !user || !supabase || hasRun.current) return;

  //   const syncUser = async () => {
  //     console.log("Attempting to sync user:", user.id);

  //     try {
  //       const { data: existingUser, error: fetchError } = await supabase
  //         .from("users")
  //         .select("id, token_balance")
  //         .eq("id", user.id)
  //         .single();

  //       if (fetchError && fetchError.code !== "PGRST116") {
  //         throw fetchError;
  //       }

  //       if (existingUser) {
  //         const { error: updateError } = await supabase
  //           .from("users")
  //           .update({
  //             email: user.primaryEmailAddress?.emailAddress,
  //             first_name: user.firstName,
  //             last_name: user.lastName,
  //           })
  //           .eq("id", user.id);

  //         if (updateError) throw updateError;
  //         console.log("Profile updated successfully!");
  //       } else {
  //         const { error: insertError } = await supabase
  //           .from("users")
  //           .insert({
  //             id: user.id,
  //             email: user.primaryEmailAddress?.emailAddress,
  //             first_name: user.firstName,
  //             last_name: user.lastName,
  //             token_balance: 0,
  //           });

  //         if (insertError) throw insertError;
  //         console.log("New profile created successfully!");
  //       }

  //       hasRun.current = true;
  //     } catch (error: any) {
  //       console.error("Profile sync failed:", error);
  //     }
  //   };

  //   syncUser();
  // }, [user, isLoaded, supabase]);

