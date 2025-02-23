# Quick Invoice

---

### Developer : Sorathiya , Aamir
### Includes : Components , Landing-Page , Login / Registration , About us , Pricing , Initial Dashboard


---

Here we start working on major project website - ***Quick Invoice***

**Working** : Invoice maker using buil-in layout and customizable templates<br>
**Technology** : React js , bootstrap , Node js , Express js ( if usage ) , mongo db , react-pdf 

**Functionality** :

- Vendors register them selves
- Login into their account
- After first login / register venders have free to use built-in templates / layouts for their invoice structure template generation - they also make their custom template for same
- This functionality is free only one time - then if vendor need major customization , need subscriptions
- After making their own invoice format ( Saved on server )
- In dashboard of venders there are many options like Make new invoice , All invoices , Search invoice , CRUD invoice , Your invoice template , customize template etc.. all option that possible

- Main functionality : Creating new invoice load first their own invoice format / template - then they fill up details with additional fields if need - then save it ( Saved in mongoDB ) - after this there are three option using React PDF - download PDF / share PDF - In share PDF vender need to provide customer email id - invoice directly send to customer mail by server

- Another Main functionality : When vender create invoice for customer , customer details needed - first time for each customer vender need to add details manually - then customer details saved to DB - after this if vendor start making invoice for same customer by entering their name or unique details like email etc - it directly automatically fill customer details that required - so vender not need to fill each and every time

---

# Front-end Structure

- **node_modules**
    - Bootstrap
    - JQuery
    - React PDF
- **src**
	- Assets - PNGs , Graphics , SVGs
	- Components - Header , Footer
	- Pages - All pages Folders > Section Folders > JSX + CSS | JSX
    - Styles
    - App JSX
    - Main JSX
- **index.html**
- **Configuration files**

---	

# Brand management 

- **Brand Font**

    - Varela Round , Varela - Brand Normal Headers , Menus
	- Lexend - Bold normal text

- **Brand color** :


```css

    --brand-primary: #4169e1;
    --brand-primary-dark: #212f3d;
    --brand-secondary-dark: #18232d;
    --brand-secondary-dark-trans: #18232de3;
    --brand-secondary-dark-2: #4F5B5E;
    --brand-primary-light: #fdfdfd;
    --brand-primary-light-trans: #fdfdfda3;
    --brand-primary-light-trans-less: #fdfdfdc3;
    --brand-primary-light-trans-more: #fdfdfd75;
    --brand-secondary-light: #fafafa;
    --brand-secondary-light-2: #fefefe;
    --brand-secondary-light-2-trans: #fefefea3;
    --brand-secondary-light-3: #fbfbfb;
    --brand-secondary-light-3-trans: #fbfbfba3;
    --brand-primary-light-2: #f9f9f9;
    --brand-primary-light-2-trans: #f9f9f9a3;
    --brand-primary-light-2-trans-less: #f9f9f9db;
    --brand-primary-light-3: #f5f5f5;
    --brand-primary-light-4: #f2f2f2;
    --brand-primary-outline: #e6e6e6;
    --brand-secondary-outline: #eeeeee;
    --brand-secondary-outline-2: #365eab;

    --brand-primary-font: 'Varela', sans-serif !important;
    --brand-primary-font-rounded: 'Varela Round', sans-serif !important;
    --brand-secondary-font: 'Lexend', sans-serif !important;

    --trans-anim: all .5s ease;

    --brand-error: #ff5733;
    --brand-warning: #ffc133;
    --brand-success: #33ff77;


```


---

# Run project , Upload project

```shell
    $ cd Component
    $ npm install
    $ npm update
    $ npm audit fix ( + --force )
    $ npm run dev
```

```shell
    $ cd Component
    $ git add .
    $ git commit -m "Your message to us"
    $ git push origin Component
    $ git clone --branch branch-name https://github.com/Aamir4245/Alone-Jolly.git
```

---

## Last Edited : 5:00 PM 18/02/2025
## Handover Date : 11:00 PM 20/02/2025