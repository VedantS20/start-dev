import { exec } from 'child_process';
import inquirer from 'inquirer';
import simpleGit from 'simple-git';


function setupBranching (){
    const git = simpleGit()

git.branch((err, branches) => {
    if (err) {
      console.error(err);
      return;
    }
    const branchNames = Object.keys(branches.branches);
    console.log(branchNames)



const ticketTypes = ['feature', 'bugfix'];

inquirer
  .prompt([
    {
        type: 'list',
        name: 'parentBranch',
        message: 'Select the parent branch that you want to branch out from.',
        choices: branchNames
    },
    {
      type: 'list',
      name: 'ticketType',
      message: 'What type of ticket?',
      choices: ticketTypes
    },
    {
      type: 'input',
      name: 'ticketId',
      message: 'Enter the ticket ID:'
    }
  ])
  .then((answers) => {
    const {parentBranch,ticketType,ticketId} = answers
    // Need To Add Git fetch incase branch on remote not updated in local
    git.checkout(parentBranch, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        git.pull((err, update) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`Latest changes pulled from ${parentBranch}.`);
          const branchName = `${ticketType}/${ticketId}`;
          console.log(branchName);
          exec(`git branch ${branchName}`, (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log(`Branch ${branchName} created successfully.`);
            git.checkoutLocalBranch(branchName)
          });
        });
      });

    console.log(answers);
  });

})
}

module.exports = setupBranching