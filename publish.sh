remote="origin"
branch="master"
dir="public"
theme="hugo-paper"
if [[ $(git status -s) ]]
then
    echo "The working directory is dirty. Proceed? y/n"
	read decision
	if [[ "$decision" != "y" ]]; then
		exit 1;
	fi
fi

echo "Deleting old publication."
rm -rf $dir
mkdir $dir
git worktree prune
rm -rf .git/worktrees/$dir/

echo "Checking out publish branch into public"
git worktree add -B $branch $dir $remote/$branch

echo "Removing existing files"
rm -rf $dir/*

echo "Generating site."
hugo -t $theme --minify

echo "Updating gh-pages branch"
if [ $# -eq 0 ]; then
	date=`date '+%Y-%m-%d %H:%M:%S'`
	msg="Add generated site as of $date."
else
	msg=$0
fi
cd $dir && git add --all && git commit -m "$msg"