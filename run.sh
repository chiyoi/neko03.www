cd ./server
go build -o ../target/www
cd ..

cd ./view
cd ./src/index
tsc --outFile ../../target/index.js
cd ../jigokutsuushin
tsc --outFile ../../target/jigokutsuushin.js
cd ../..
cd ./target
for f in *.js; do
    jsmin --overwrite $f
done
cd ../..

cd target
cp -r ../assets ./
test ! -e view && mkdir view
cp ../view/target/* ./view
./www
cd ..
