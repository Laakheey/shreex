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
      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.log("Email not loaded yet, retrying...");
        setTimeout(syncUser, 1000);
        return;
      }

      try {
        // 1. Check if user exists by email
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (existingUser) {
          // Case A: Same Clerk ID - just update names
          if (existingUser.id === user.id) {
            await supabase
              .from("users")
              .update({
                first_name: user.firstName || existingUser.first_name,
                last_name: user.lastName || existingUser.last_name,
              })
              .eq("id", user.id);
            console.log("✅ User already synced");
          } 
          // Case B: Different Clerk ID - MIGRATION NEEDED
          else {
            console.log(`🔄 MIGRATION START: ${existingUser.id} → ${user.id}`);
            
            const oldClerkId = existingUser.id;
            const newClerkId = user.id;

            // STEP 1: Update all foreign key references
            console.log("📝 Updating foreign keys...");

            // Update token_requests
            const { error: tokenRequestsError } = await supabase
              .from("token_requests")
              .update({ user_id: newClerkId })
              .eq("user_id", oldClerkId);
            if (tokenRequestsError) console.error("❌ token_requests update failed:", tokenRequestsError);
            else console.log("✅ token_requests updated");

            // Update investments
            const { error: investmentsError } = await supabase
              .from("investments")
              .update({ user_id: newClerkId })
              .eq("user_id", oldClerkId);
            if (investmentsError) console.error("❌ investments update failed:", investmentsError);
            else console.log("✅ investments updated");

            // Update withdrawals
            const { error: withdrawalsError } = await supabase
              .from("withdrawals")
              .update({ user_id: newClerkId })
              .eq("user_id", oldClerkId);
            if (withdrawalsError) console.error("❌ withdrawals update failed:", withdrawalsError);
            else console.log("✅ withdrawals updated");

            // Update user_monthly_performance
            const { error: performanceError } = await supabase
              .from("user_monthly_performance")
              .update({ user_id: newClerkId })
              .eq("user_id", oldClerkId);
            if (performanceError) console.error("❌ user_monthly_performance update failed:", performanceError);
            else console.log("✅ user_monthly_performance updated");

            // Update referrals - referrer_id
            const { error: referralsReferrerError } = await supabase
              .from("referrals")
              .update({ referrer_id: newClerkId })
              .eq("referrer_id", oldClerkId);
            if (referralsReferrerError) console.error("❌ referrals (referrer_id) update failed:", referralsReferrerError);
            else console.log("✅ referrals (referrer_id) updated");

            // Update referrals - referred_id
            const { error: referralsReferredError } = await supabase
              .from("referrals")
              .update({ referred_id: newClerkId })
              .eq("referred_id", oldClerkId);
            if (referralsReferredError) console.error("❌ referrals (referred_id) update failed:", referralsReferredError);
            else console.log("✅ referrals (referred_id) updated");

            // Update referral_bonuses - referrer_id
            const { error: bonusesReferrerError } = await supabase
              .from("referral_bonuses")
              .update({ referrer_id: newClerkId })
              .eq("referrer_id", oldClerkId);
            if (bonusesReferrerError) console.error("❌ referral_bonuses (referrer_id) update failed:", bonusesReferrerError);
            else console.log("✅ referral_bonuses (referrer_id) updated");

            // Update referral_bonuses - referred_user_id
            const { error: bonusesReferredError } = await supabase
              .from("referral_bonuses")
              .update({ referred_user_id: newClerkId })
              .eq("referred_user_id", oldClerkId);
            if (bonusesReferredError) console.error("❌ referral_bonuses (referred_user_id) update failed:", bonusesReferredError);
            else console.log("✅ referral_bonuses (referred_user_id) updated");

            // Update users table - referrer_id (self-referencing)
            const { error: usersReferrerError } = await supabase
              .from("users")
              .update({ referrer_id: newClerkId })
              .eq("referrer_id", oldClerkId);
            if (usersReferrerError) console.error("❌ users (referrer_id) update failed:", usersReferrerError);
            else console.log("✅ users (referrer_id) updated");

            console.log("✅ All foreign keys updated");

            // STEP 2: Preserve old user data
            const oldData = { ...existingUser };
            delete oldData.idx; // Remove auto-increment ID if exists

            // STEP 3: Delete old user record
            const { error: deleteError } = await supabase
              .from("users")
              .delete()
              .eq("id", oldClerkId);

            if (deleteError) {
              console.error("❌ Failed to delete old user:", deleteError);
              throw deleteError;
            }
            console.log("✅ Old user record deleted");

            // STEP 4: Insert with new Clerk ID
            const { error: insertError } = await supabase
              .from("users")
              .insert({
                id: newClerkId,
                email: oldData.email,
                first_name: user.firstName || oldData.first_name,
                last_name: user.lastName || oldData.last_name,
                token_balance: oldData.token_balance,
                referral_code: oldData.referral_code,
                is_admin: oldData.is_admin,
                referrer_id: oldData.referrer_id, // This will already be updated if it was the old ID
                is_active: oldData.is_active,
              });

            if (insertError) {
              console.error("❌ Migration failed:", insertError);
              throw insertError;
            }

            console.log("✅✅✅ MIGRATION COMPLETE! All data preserved.");
            console.log(`User ${email} migrated from ${oldClerkId} to ${newClerkId}`);
          }
        } else {
          // Truly new user
          await supabase.from("users").insert({
            id: user.id,
            email,
            first_name: user.firstName,
            last_name: user.lastName,
            token_balance: 0,
            referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          });
          console.log("✅ New user created");
        }

        hasRun.current = true;
      } catch (error: any) {
        console.error("❌ Sync failed:", error.message);
        console.error("Full error:", error);
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

