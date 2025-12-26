-- AddForeignKey
ALTER TABLE "skripsi_sets" ADD CONSTRAINT "skripsi_sets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
