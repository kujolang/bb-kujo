const raw=process.argv[2];
if(!raw) throw new Error('Pass the verified public GitHub repository URL.');
const url=new URL(raw);
if(url.protocol!=='https:'||url.hostname!=='github.com'||!/^\/[\w.-]+\/[\w.-]+\/?$/.test(url.pathname)||url.username||url.password||url.search||url.hash) throw new Error('Expected https://github.com/OWNER/REPO');
const repo=url.href.replace(/\/$/,'').replace(/\.git$/,'');
console.log(JSON.stringify({$schema:'https://getbb.app/schemas/marketplace-v2.schema.json',schemaVersion:2,name:'kujo',displayName:'Kujo',description:'Kujo design-system adapters for bb.',plugins:[{id:'bb-kujo',displayName:'Kujo',description:'A mechanical workspace skin based on Kujo and SiteKit.',icon:{url:'assets/kujo-mark.svg'},category:'themes-and-appearance',tags:['theme','kujo','sitekit'],screenshots:['background-still','editor-files','terminal'].map(name=>repo.replace('github.com','raw.githubusercontent.com')+'/main/screenshots/'+name+'.png'),author:{name:'Robert DeVore',github:'robertdevore'},source:{git:{url:repo,ref:'main'}}}]},null,2));
