# copymanga.site

1. `pnpm i`
2. 在 `app.ts` 中填写 url 地址。地址为第几话或者第几卷，比如 `葬送的芙莉莲 - 第01话`

   ```ts
   const list: { url: string }[] = [
     // 填写 url 地址
     {
       url: "https://www.copymanga.site/comic/zangsongdefulilian/chapter/50a49a20-8967-11ea-bb0b-00163e0ca5bd",
     },
   ];
   ```

3. `pnpm start`
