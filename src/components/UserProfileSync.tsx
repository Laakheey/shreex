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
//       console.log("Attempting to sync user:", user.id);

//       try {
//         const { data: existingUser, error: fetchError } = await supabase
//           .from("users")
//           .select("id, token_balance")
//           .eq("id", user.id)
//           .single();

//         if (fetchError && fetchError.code !== "PGRST116") {
//           throw fetchError;
//         }

//         if (existingUser) {
//           const { error: updateError } = await supabase
//             .from("users")
//             .update({
//               email: user.primaryEmailAddress?.emailAddress,
//               first_name: user.firstName,
//               last_name: user.lastName,
//             })
//             .eq("id", user.id);

//           if (updateError) throw updateError;
//           console.log("Profile updated successfully!");
//         } else {
//           const { error: insertError } = await supabase.from("users").insert({
//             id: user.id,
//             email: user.primaryEmailAddress?.emailAddress,
//             first_name: user.firstName,
//             last_name: user.lastName,
//             token_balance: 0,
//           });

//           if (insertError) throw insertError;
//           console.log("New profile created successfully!");
//         }

//         hasRun.current = true;
//       } catch (error: any) {
//         console.error("Profile sync failed:", error);
//       }
//     };

//     syncUser();
//   }, [user, isLoaded, supabase]);

//   return null;
// };

// export default UserProfileSync;



// // useEffect(() => {
//   //   if (!isLoaded || !user || !supabase || hasRun.current) return;

//   //   const syncUser = async () => {
//   //     const email = user.primaryEmailAddress?.emailAddress;
//   //     if (!email) return;

//   //     const { data: existingUser } = await supabase
//   //       .from("users")
//   //       .select("*")
//   //       .eq("email", email)
//   //       .maybeSingle();

//   //     if (existingUser) {
//   //       await supabase
//   //         .from("users")
//   //         .update({
//   //           id: user.id,
//   //           first_name: user.firstName,
//   //           last_name: user.lastName,
//   //         })
//   //         .eq("email", email);

//   //       console.log("Updated existing user with new Clerk ID");
//   //     } else {
//   //       await supabase.from("users").insert({
//   //         id: user.id,
//   //         email,
//   //         first_name: user.firstName,
//   //         last_name: user.lastName,
//   //         token_balance: 0,
//   //         referral_code: Math.random()
//   //           .toString(36)
//   //           .substring(2, 8)
//   //           .toUpperCase(),
//   //       });
//   //     }

//   //     hasRun.current = true;
//   //   };

//   //   syncUser();
//   // }, [user, isLoaded, supabase]);


// // import { useEffect, useRef } from "react";
// // import { useUser } from "@clerk/clerk-react";
// // import { useSupabase } from "./providers/SupabaseProvider";

// // const UserProfileSync: React.FC = () => {
// //   const { user, isLoaded } = useUser();
// //   const supabase = useSupabase();
// //   const hasRun = useRef(false);

// //   useEffect(() => {
// //     if (!isLoaded || !user || !supabase || hasRun.current) return;

// //     const syncUser = async () => {
// //       const email = user.primaryEmailAddress?.emailAddress;
// //       if (!email) {
// //         console.log("⏳ Email not loaded yet, retrying in 1 second...");
// //         setTimeout(syncUser, 1000);
// //         return;
// //       }

// //       try {
// //         console.log(`🔍 Checking user: ${email} with Clerk ID: ${user.id}`);

// //         // STEP 1: Check if this exact Clerk ID already exists
// //         const { data: exactMatch } = await supabase
// //           .from("users")
// //           .select("*")
// //           .eq("id", user.id)
// //           .maybeSingle();

// //         if (exactMatch) {
// //           console.log("✅ User already exists with correct Clerk ID - updating names only");
// //           await supabase
// //             .from("users")
// //             .update({
// //               first_name: user.firstName || exactMatch.first_name,
// //               last_name: user.lastName || exactMatch.last_name,
// //               email: email, // Ensure email is set
// //             })
// //             .eq("id", user.id);

// //           hasRun.current = true;
// //           return;
// //         }

// //         // STEP 2: Check if user exists by email (potential migration case)
// //         const { data: emailMatch } = await supabase
// //           .from("users")
// //           .select("*")
// //           .eq("email", email)
// //           .maybeSingle();

// //         if (emailMatch && emailMatch.id !== user.id) {
// //           // MIGRATION CASE: User exists with different Clerk ID
// //           console.log(`🔄 MIGRATION DETECTED!`);
// //           console.log(`   Email: ${email}`);
// //           console.log(`   Old Clerk ID: ${emailMatch.id}`);
// //           console.log(`   New Clerk ID: ${user.id}`);

// //           const oldClerkId = emailMatch.id;
// //           const newClerkId = user.id;

// //           // STEP 3: Update all foreign key references
// //           console.log("📝 Step 1/4: Updating foreign key references...");

// //           const updatePromises = [
// //             supabase.from("token_requests").update({ user_id: newClerkId }).eq("user_id", oldClerkId),
// //             supabase.from("investments").update({ user_id: newClerkId }).eq("user_id", oldClerkId),
// //             supabase.from("withdrawals").update({ user_id: newClerkId }).eq("user_id", oldClerkId),
// //             supabase.from("user_monthly_performance").update({ user_id: newClerkId }).eq("user_id", oldClerkId),
// //             supabase.from("referrals").update({ referrer_id: newClerkId }).eq("referrer_id", oldClerkId),
// //             supabase.from("referrals").update({ referred_id: newClerkId }).eq("referred_id", oldClerkId),
// //             supabase.from("referral_bonuses").update({ referrer_id: newClerkId }).eq("referrer_id", oldClerkId),
// //             supabase.from("referral_bonuses").update({ referred_user_id: newClerkId }).eq("referred_user_id", oldClerkId),
// //             supabase.from("users").update({ referrer_id: newClerkId }).eq("referrer_id", oldClerkId),
// //           ];

// //           const results = await Promise.allSettled(updatePromises);

// //           const tableNames = [
// //             "token_requests", "investments", "withdrawals", "user_monthly_performance",
// //             "referrals (referrer)", "referrals (referred)",
// //             "referral_bonuses (referrer)", "referral_bonuses (referred)", "users (referrer)"
// //           ];

// //           results.forEach((result, index) => {
// //             if (result.status === "fulfilled") {
// //               console.log(`   ✅ ${tableNames[index]} updated`);
// //             } else {
// //               console.error(`   ❌ ${tableNames[index]} failed:`, result.reason);
// //             }
// //           });

// //           // STEP 4: Preserve old user data
// //           console.log("📝 Step 2/4: Preserving user data...");
// //           const oldData = { ...emailMatch };
// //           delete oldData.idx; // Remove auto-increment ID

// //           // STEP 5: Delete old user record
// //           console.log("📝 Step 3/4: Removing old Clerk ID record...");
// //           const { error: deleteError } = await supabase
// //             .from("users")
// //             .delete()
// //             .eq("id", oldClerkId);

// //           if (deleteError) {
// //             console.error("❌ Failed to delete old user record:", deleteError);
// //             throw deleteError;
// //           }
// //           console.log("   ✅ Old record deleted");

// //           // STEP 6: Insert with new Clerk ID
// //           console.log("📝 Step 4/4: Creating new record with prod Clerk ID...");
// //           const { error: insertError } = await supabase
// //             .from("users")
// //             .insert({
// //               id: newClerkId,
// //               email: email,
// //               first_name: user.firstName || oldData.first_name,
// //               last_name: user.lastName || oldData.last_name,
// //               token_balance: oldData.token_balance,
// //               referral_code: oldData.referral_code,
// //               is_admin: oldData.is_admin,
// //               referrer_id: oldData.referrer_id,
// //               is_active: oldData.is_active,
// //             });

// //           if (insertError) {
// //             console.error("❌ Migration failed at insert:", insertError);
// //             throw insertError;
// //           }

// //           console.log("✅✅✅ MIGRATION COMPLETE!");
// //           console.log(`   User: ${email}`);
// //           console.log(`   Old ID: ${oldClerkId}`);
// //           console.log(`   New ID: ${newClerkId}`);
// //           console.log(`   Token Balance: ${oldData.token_balance}`);
// //           console.log(`   Referral Code: ${oldData.referral_code}`);
// //           console.log(`   Admin Status: ${oldData.is_admin}`);

// //         } else {
// //           // STEP 7: Truly new user (no email match found)
// //           console.log("🆕 Creating brand new user");
// //           const { error: insertError } = await supabase.from("users").insert({
// //             id: user.id,
// //             email,
// //             first_name: user.firstName,
// //             last_name: user.lastName,
// //             token_balance: 0,
// //             referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
// //             is_admin: false,
// //             is_active: true,
// //           });

// //           if (insertError) {
// //             console.error("❌ Failed to create new user:", insertError);
// //             throw insertError;
// //           }
// //           console.log("✅ New user created successfully");
// //         }

// //         hasRun.current = true;
// //       } catch (error: any) {
// //         console.error("❌ SYNC FAILED:", error.message);
// //         console.error("Full error details:", error);
// //         // Don't set hasRun to true on error, allow retry on next render
// //       }
// //     };

// //     syncUser();
// //   }, [user, isLoaded, supabase]);

// //   return null;
// // };

// // export default UserProfileSync;

// // useEffect(() => {
// //   if (!isLoaded || !user || !supabase || hasRun.current) return;

// //   const syncUser = async () => {
// //     console.log("Attempting to sync user:", user.id);

// //     try {
// //       const { data: existingUser, error: fetchError } = await supabase
// //         .from("users")
// //         .select("id, token_balance")
// //         .eq("id", user.id)
// //         .single();

// //       if (fetchError && fetchError.code !== "PGRST116") {
// //         throw fetchError;
// //       }

// //       if (existingUser) {
// //         const { error: updateError } = await supabase
// //           .from("users")
// //           .update({
// //             email: user.primaryEmailAddress?.emailAddress,
// //             first_name: user.firstName,
// //             last_name: user.lastName,
// //           })
// //           .eq("id", user.id);

// //         if (updateError) throw updateError;
// //         console.log("Profile updated successfully!");
// //       } else {
// //         const { error: insertError } = await supabase
// //           .from("users")
// //           .insert({
// //             id: user.id,
// //             email: user.primaryEmailAddress?.emailAddress,
// //             first_name: user.firstName,
// //             last_name: user.lastName,
// //             token_balance: 0,
// //           });

// //         if (insertError) throw insertError;
// //         console.log("New profile created successfully!");
// //       }

// //       hasRun.current = true;
// //     } catch (error: any) {
// //       console.error("Profile sync failed:", error);
// //     }
// //   };

// //   syncUser();
// // }, [user, isLoaded, supabase]);
