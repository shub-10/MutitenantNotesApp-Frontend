**CREDENTIALS FOR TEST ACCOUNTS:**
Email: admin@acme.test (Admin, tenant: Acme)
Email: user@acme.test (Member, tenant: Acme)
Email: admin@globex.test (Admin, tenant: Globex)
Email: user@globex.test (Member, tenant: Globex)

**PASSWORD: adminPassword**

**---Approach---**

I have used Shared Schema with Tenantid column as reference in User and Notes table.
I have created 3 schemas:
1. Tenant: {name, slug, tenantid}
2. Note: {title, description, tenantid, authorid}
3. User: {email, password, role, tenantid}
Along with this authentication is implemented using JWT.


Each User and note is corresponding to a tenant and used tenantid as reference.

**How I have isolated Notes of a particular tenant from another:**
  During login user will send tenant/organisation along with email and password, based on which i filter out the notes which have the tenantid 
  corresponding to the tenant.











