const fs = require('fs');

const fixLayout = (file, isInbox = false) => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // We are targeting the row div which starts with:
  // <div key={project.id} className="flex items-center justify-between py-4 border-b border-cream/5 group">
  // or similar.
  
  if (file.includes('ProjectsClient')) {
    content = content.replace(
      /<div className="min-w-0">[\s\S]*?<span className="font-mono text-sm font-bold text-cream">[\s\S]*?{project\.name}[\s\S]*?<\/span>[\s\S]*?<p className="font-mono text-xs text-cream\/20 truncate max-w-xs mt-0.5">[\s\S]*?{project\.description}[\s\S]*?<\/p>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 ml-4">/m,
      `<div className="grid grid-cols-12 gap-4 items-center w-full min-w-0">
                <div className="col-span-10 md:col-span-4">
                  <span className="font-mono text-sm font-bold text-cream truncate block">{project.name}</span>
                </div>
                <div className="hidden md:block md:col-span-6">
                  <p className="font-mono text-xs text-cream/20 truncate">{project.description}</p>
                </div>
                <div className="col-span-2 md:col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">`
    );
  } 
  else if (file.includes('ExperienceClient')) {
    content = content.replace(
      /<div className="flex items-center gap-4">[\s\S]*?<span className="font-mono text-sm font-bold text-cream">{job\.role}<\/span>[\s\S]*?<span className="font-mono text-sm text-cream\/20 hidden md:inline">{job\.project}<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">/m,
      `<div className="grid grid-cols-12 gap-4 items-center w-full min-w-0">
                <div className="col-span-10 md:col-span-4">
                  <span className="font-mono text-sm font-bold text-cream truncate block">{job.role}</span>
                </div>
                <div className="hidden md:block md:col-span-6">
                  <span className="font-mono text-sm text-cream/20 truncate block">{job.project}</span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">`
    );
  }
  else if (file.includes('CertificationsClient')) {
    content = content.replace(
      /<div className="flex items-center gap-4">[\s\S]*?<span className="font-mono text-sm font-bold text-cream">{cert\.name}<\/span>[\s\S]*?<span className="font-mono text-sm text-cream\/20 hidden md:inline">{cert\.issuer}<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">/m,
      `<div className="grid grid-cols-12 gap-4 items-center w-full min-w-0">
                <div className="col-span-10 md:col-span-6">
                  <span className="font-mono text-sm font-bold text-cream truncate block">{cert.name}</span>
                </div>
                <div className="hidden md:block md:col-span-4">
                  <span className="font-mono text-sm text-cream/20 truncate block">{cert.issuer}</span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">`
    );
  }
  else if (file.includes('StackClient')) {
    content = content.replace(
      /<div className="flex items-center gap-4">[\s\S]*?<span className="font-mono text-sm font-bold text-cream">{skill\.name}<\/span>[\s\S]*?<span className="font-mono text-sm text-cream\/20 hidden md:inline">{skill\.category}<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">/m,
      `<div className="grid grid-cols-12 gap-4 items-center w-full min-w-0">
                <div className="col-span-10 md:col-span-4">
                  <span className="font-mono text-sm font-bold text-cream truncate block">{skill.name}</span>
                </div>
                <div className="hidden md:block md:col-span-6">
                  <span className="font-mono text-sm text-cream/20 truncate block">{skill.category}</span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">`
    );
  }

  // Remove the wrapper flex items-center justify-between in all files since grid is now handling it
  content = content.replace(/className="flex items-center justify-between py-([34]) border-b border-cream\/5 group"/g, 'className="flex py-$1 border-b border-cream/5 group"');

  fs.writeFileSync(file, content);
};

fixLayout('components/admin/ProjectsClient.tsx');
fixLayout('components/admin/ExperienceClient.tsx');
fixLayout('components/admin/CertificationsClient.tsx');
fixLayout('components/admin/StackClient.tsx');
console.log("Layout fixed");
