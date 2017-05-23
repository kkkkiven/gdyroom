
#!/bin/bash  
  


rm -rf ./packages/update
echo "删除文件成功"
rm -rf ./packages/update.zip
echo "删除文件压缩包成功"
mkdir ./packages/update
echo "创建目录成功"
cp -r ./build/jsb-default/res ./packages/update/res
cp -r ./build/jsb-default/src ./packages/update/src
cp ./assets/version.manifest ./packages/update/version.manifest
cp ./assets/project.manifest ./packages/update/project.manifest
echo "COPY 成功"
cd ./packages
zip -r -q -m update.zip update
echo "压缩成功"
# scp -P 1366 ./update.zip root@120.77.182.100:/root/client-cdn/zlt-tdk/publish-assets/
scp -P 1366 ./update.zip root@112.74.49.68:/root/client-cdn/gdy/publish-assets/

echo "上传成功"
echo "上传成功"
#变量定义 
ip="112.74.49.68"  
user="root"  
remote_cmd="/root/test.sh"  
port="1366"  
#本地通过ssh执行远程服务器的脚本  
ssh -t -p $port $user@$ip "/root/client-cdn/update_gdy.sh"  
