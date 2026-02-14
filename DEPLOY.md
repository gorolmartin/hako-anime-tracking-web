# Step-by-step: Deploy AnimeTracking Web with GitHub + Vercel

This guide assumes you’re starting from scratch: no GitHub repo yet and no git in this project. Follow the steps in order.

---

## Step 1: Get a GitHub account (if you don’t have one)

1. Go to [github.com](https://github.com) and click **Sign up**.
2. Create an account (email, password, username).
3. Verify your email if GitHub asks you to.

---

## Step 2: Create a new repository on GitHub

1. Log in to GitHub.
2. Click the **+** in the top-right → **New repository**.
3. Fill in:
   - **Repository name:** e.g. `anime-tracking-web` (or any name you like).
   - **Description:** optional (e.g. “AnimeTracking landing page”).
   - **Public** (recommended).
   - **Do not** check “Add a README file”, “Add .gitignore”, or “Choose a license” (this project already has its own).
4. Click **Create repository**.
5. Leave the page open. You’ll see a URL like `https://github.com/YOUR_USERNAME/anime-tracking-web.git`. You’ll need it in Step 4.

---

## Step 3: Turn this folder into a git repo and make the first commit

Open a terminal and go to this project folder. Then run these commands one by one.

**3.1 – Go to the project folder** (if you’re not already there):

```bash
cd "/Users/gory/Library/CloudStorage/Dropbox/Work/Development/AnimeTracking Web"
```

**3.2 – Initialize git:**

```bash
git init
```

**3.3 – Stage all files:**

```bash
git add .
```

**3.4 – First commit:**

```bash
git commit -m "Initial commit"
```

**3.5 – Name the main branch `main`:**

```bash
git branch -M main
```

---

## Step 4: Connect this repo to GitHub and push

**4.1 – Add your GitHub repo as the “remote”.**  
Replace `YOUR_USERNAME` with your GitHub username and `YOUR_REPO` with the repo name you chose (e.g. `anime-tracking-web`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

Example: if your username is `johndoe` and the repo is `anime-tracking-web`:

```bash
git remote add origin https://github.com/johndoe/anime-tracking-web.git
```

**4.2 – Push your code to GitHub:**

```bash
git push -u origin main
```

- If GitHub asks you to log in, use your GitHub username and a **Personal Access Token** (not your normal password).  
- To create a token: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**. Give it a name, check **repo**, then generate and copy the token. Use that token as the password when `git push` asks.

After this, your code is on GitHub and you’ll see it at `https://github.com/YOUR_USERNAME/YOUR_REPO`.

---

## Step 5: Deploy on Vercel (import from GitHub)

1. Go to [vercel.com](https://vercel.com).
2. Click **Sign Up** and choose **Continue with GitHub**. Authorize Vercel to use your GitHub account.
3. After logging in, click **Add New** → **Project**.
4. You should see your GitHub repo in the list (e.g. `anime-tracking-web`). Click **Import** next to it.
5. Vercel will detect Next.js. Leave the settings as they are (Framework Preset: Next.js, Root Directory: empty, Build Command: `next build`, etc.).
6. Click **Deploy**.
7. Wait for the build to finish. You’ll get a link like `https://anime-tracking-web-xxxx.vercel.app` — that’s your live site.

From now on, every time you push to `main` on GitHub, Vercel will redeploy automatically.

---

## Step 6: Add a custom domain (optional)

When you’re ready to use your own domain (e.g. `animetracking.com`):

1. In Vercel, open your project.
2. Go to **Settings** → **Domains**.
3. Enter your domain (e.g. `animetracking.com` or `www.animetracking.com`) and click **Add**.
4. Vercel will show the DNS records you need. In your domain registrar’s DNS settings, add:
   - For the **root** domain: an **A** record pointing to the IP Vercel shows (e.g. `76.76.21.21`).
   - For **www**: a **CNAME** record pointing to the value Vercel shows (e.g. `cname.vercel-dns.com`).
5. Wait for DNS to update (minutes to a few hours). When the domain shows as **Valid** in Vercel, HTTPS will work automatically.

---

## Quick reference

| Step | What you do |
|------|------------------|
| 1 | Create GitHub account (if needed) |
| 2 | Create a new **empty** repo on GitHub (no README, no .gitignore) |
| 3 | In the project folder: `git init` → `git add .` → `git commit -m "Initial commit"` → `git branch -M main` |
| 4 | `git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git` then `git push -u origin main` |
| 5 | vercel.com → Add New → Project → Import your repo → Deploy |
| 6 | (Optional) Settings → Domains → add domain and set DNS at your registrar |

If something doesn’t match (e.g. GitHub asks for 2FA or a token), the steps above point you to the right place (tokens, etc.). For “I don’t have the project set up”, this is the full path from zero to deployed.
