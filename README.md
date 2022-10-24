<p align="center">
  <a href="https://www.medusa-commerce.com">
    <img alt="Medusa" src="https://i.imgur.com/USubGVY.png" width="100" />
  </a>
</p>

<h1 align="center">
  Aurore Server Starter
</h1>

# Overview

![aurore-cover](https://github.com/traleor/aurore-frontend/blob/main/public/cover.png)

## [Live Demo](https://aurore-storefront.herokuapp.com/)

Aurore is a Multi-vendor marketplace built using Medusa, Wagtail for the CMS and Next.Js for the Front-end.
This marketplace is easy to maintain and update to the latest Medusa version as it is built entirely with the tools provided by Medusa (no third-party included).

## Participants:

<!-- markdown table with the team infos -->

| Name        | Github                                   | Twitter                                      | Discord              |
| ----------- | ---------------------------------------- | -------------------------------------------- | -------------------- |
| Peng Boris  | [Github](https://github.com/itzomen)     | [Twitter](https://twitter.com/itz_omen)      | `itzomen#4530`       |
| Njoh Prince | [Github](https://github.com/NjohPrince)  | [Twitter](https://twitter.com/NjohNoh)       | `theunicorndev#2216` |
| Egbe Nesta  | [Github](https://github.com/nestaenow)   | [Twitter](https://twitter.com/nestaenow)     | `NestaEnow#4271`     |
| Meli Imelda | [Github](https://github.com/meli-imelda) | [Twitter](https://twitter.com/Meli_Tchouala) | `MeliImelda#2152`    |


### Preview
![aurore-demo](https://user-images.githubusercontent.com/61752841/197415990-5931a38b-9504-4238-b602-5784c0a11950.gif)

## Prerequisites

This starter has minimal prerequisites and most of these will usually already be installed on your computer.

- [Install Node.js](https://nodejs.org/en/download/)
- [Install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Install SQLite](https://www.sqlite.org/download.html)

## Setting up your store

- Clone this Medusa project
  ```
  git clone <repo-link>
  ```
- Run your project
  ```
  cd aurore-medusa && npm i
  # or using pnpm
  # CD aurore-medusa && pnpm i
  # NB: First migration migrates medusa models, so you need to run it twice
  # so custom models can be migrated
  medusa migrations run
  # start server
  medusa develop
  ```

Your local Medusa server is now running on port **9000**.

### Database Migrations

```bash
# generate the migration file
npx typeorm migration:create -n UserChanged --dir src/migrations
# build files
npm run build
# migrate
# NB: First migration migrates medusa models, so you need to run it twice
# so custom models can be migrated
medusa migrations run
```

### Seeding your Medusa store

---

To seed your medusa store run the following command:

```
medusa seed -f ./data/seed.json
```

This command seeds your database with some sample data to get you started, including a store, an administrator account, a region and a product with variants. What the data looks like precisely you can see in the `./data/seed.json` file.

## Try it out

```
curl -X GET localhost:9000/store/products | python -m json.tool
```

After the seed script has run you will have the following things in you database:

- a User with the email: admin@medusa-test.com and password: supersecret
- a Region called Default Region with the countries GB, DE, DK, SE, FR, ES, IT
- a Shipping Option called Standard Shipping which costs 10 EUR
- a Product called Cool Test Product with 4 Product Variants that all cost 19.50 EUR

Visit [docs.medusa-commerce.com](https://docs.medusa-commerce.com) for further guides.

<p>
  <a href="https://www.medusa-commerce.com">
    Website
  </a> 
  |
  <a href="https://medusajs.notion.site/medusajs/Medusa-Home-3485f8605d834a07949b17d1a9f7eafd">
    Notion Home
  </a>
  |
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    Twitter
  </a>
  |
  <a href="https://docs.medusa-commerce.com">
    Docs
  </a>
</p>
