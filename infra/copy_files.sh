TMP_DIR=infra/.terraform/archive_files/tmp
cd .. && rm -rf $TMP_DIR && mkdir -p $TMP_DIR && cp -r node_modules $TMP_DIR/ && cp package.json $TMP_DIR/ && cp src/* $TMP_DIR/