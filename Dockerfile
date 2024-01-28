FROM oven/bun:latest as builder
WORKDIR /usr/src/app
COPY package.json bun.lockb* ./
RUN bun install
COPY . .
RUN bun build --target=bun ./src/index.ts --outdir ./dist

FROM oven/bun:latest
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
CMD ["bun", "run", "./dist/index.js"]
