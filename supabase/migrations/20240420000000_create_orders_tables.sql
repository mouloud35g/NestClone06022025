-- Create orders table
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  total decimal(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status_history jsonb[] default array[]::jsonb[]
);

-- Create order_items table
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) not null,
  product_id uuid references products(id) not null,
  quantity integer not null check (quantity > 0),
  price decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- Create policies
create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can create their own orders"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all orders"
  on orders for select
  using (auth.jwt() ->> 'email' like '%@admin.com');

create policy "Admins can update orders"
  on orders for update
  using (auth.jwt() ->> 'email' like '%@admin.com');

-- Similar policies for order_items
create policy "Users can view their own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can create their own order items"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items"
  on order_items for select
  using (auth.jwt() ->> 'email' like '%@admin.com');

-- Create function to update order total
create or replace function update_order_total()
returns trigger as $$
begin
  update orders
  set total = (
    select sum(quantity * price)
    from order_items
    where order_id = new.order_id
  )
  where id = new.order_id;
  return new;
end;
$$ language plpgsql;

-- Create trigger to update order total
create trigger update_order_total
after insert or update or delete on order_items
for each row execute function update_order_total();

-- Enable realtime
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;
