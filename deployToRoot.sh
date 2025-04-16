while getopts k:h: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployToRoot.sh -k <pem key file> -h <hostname>\n\n"
    exit 1
fi

printf "\n----> Deploying backend service to $hostname with $key\n"

# Step 1
printf "\n----> Build the distribution package\n"
rm -rf build
mkdir build
npm install # Install dependencies
npm run build # Build the React frontend
cp -rf dist build/public # Move the React frontend to the build directory
cp service/*.js build # Copy backend service files
cp service/*.json build # Copy backend configuration files

# Step 2
printf "\n----> Clearing out previous distribution on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
rm -rf /var/www/familybudget/*
mkdir -p /var/www/familybudget
ENDSSH

# Step 3
printf "\n----> Copy the distribution package to the target\n"
scp -r -i "$key" build/* ubuntu@$hostname:/var/www/familybudget/

# Step 4
printf "\n----> Restart the backend service on the target\n"
ssh -i "$key" ubuntu@$hostname << ENDSSH
cd /var/www/familybudget
npm install
pm2 restart familybudget
ENDSSH

# Step 5
printf "\n----> Removing local copy of the distribution package\n"
rm -rf build
rm -rf dist