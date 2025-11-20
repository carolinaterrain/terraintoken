-- Add policies for user_roles table
create policy "Users can view their own roles"
on public.user_roles for select
to authenticated
using (user_id = auth.uid());

create policy "Admins can manage all roles"
on public.user_roles
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'));