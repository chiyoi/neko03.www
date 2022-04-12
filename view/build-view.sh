cd ./src/index; tsc; cd ../..
cd ./src/jigokutsuushin; tsc; cd ../..
cd ./target
for f in *.js; do
    jsmin --overwrite $f
done
cd ..
