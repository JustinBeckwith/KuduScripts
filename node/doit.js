var path = require('path'),
	child_process = require('child_process'),
	util = require('util'),
	wrench = require('wrench');


// :: ----------------------
// :: KUDU Deployment Script
// :: ----------------------
// ::
// :: INPUTS:
// :: -------
// :: REPOSITORY_ROOT_PATH
// :: TEMPORARY_DIRECTORY_PATH
// :: WEB_ROOT_PATH
// :: MANIFEST_PATH
// :: PROJECT_TYPE
// :: PROJECT_FILE_PATH
// :: SOLUTION_FILE_PATH


console.log(process.env.DEPLOYMENT_SOURCE);
console.log(process.env.DEPLOYMENT_TARGET);
console.log(process.env.DEPLOYMENT_TEMP);



var project = "DeploymentScriptDemo\\DeploymentScriptDemo.csproj";
var config = 'Release';

console.log('building %s', project);
var buildCommand = util.format("%WINDIR%\\Microsoft.NET\\Framework\\v4.0.30319\\MSBuild %s /v:minimal /t:pipelinePreDeployCopyAllFilesToOneFolder /p:Configuration=%s /p:SolutionDir=%s /p:_PackageTempDir=\"%s\" /p:AutoParameterizationWebConfigConnectionStrings=false", 
						project, config, process.env.DEPLOYMENT_SOURCE, process.env.DEPLOYMENT_TEMP);
console.log('build command %s', buildCommand);
var msbuild = child_process.exec(buildCommand, function(error, stdout, stderr) {
	if (error) {
    	console.log(error.stack);
    	console.log('Error code: '+error.code);
    	console.log('Signal received: '+error.signal);    	
    	process.exit(1);    	
	}
	if (stderr) console.error(stderr);
	if (stdout)	console.log(stdout);
});

msbuild.on('exit', function (code) {
   console.log('MSBuild exited with exit code ' + code);

   // Copy the artifacts to the target
	console.log('Copying files from %s to %s', process.env.DEPLOYMENT_TEMP, process.env.DEPLOYMENT_TARGET);
	wrench.copyDirSyncRecursive(process.env.DEPLOYMENT_TEMP, process.env.DEPLOYMENT_TARGET);

	process.exit(0);
});


// remote: {
// 	"ALLUSERSPROFILE":"C:\\DWASFiles\\Sites\\DeploymentScriptDemo\\ProgramData",
// 	"APPDATA":"C:\\DWASFiles\\Sites\\DeploymentScriptDemo\\AppData",
// 	"APP_POOL_CONFIG":"C:\\DWASFiles\\Sites\\DeploymentScriptDemo\\Config\\applicationhost.config",
// 	"APP_POOL_ID":"DeploymentScriptDemo",
// 	"COMMONPROGRAMFILES":"D:\\Program Files (x86)\\Common Files",
// 	"COMMONPROGRAMFILES(X86)":"D:\\Program Files (x86)\\Common Files",
// 	"COMMONPROGRAMW6432":"D:\\Program Files\\Common Files",
// 	"COMPUTERNAME":"RD00155D440F9B",
// 	"COMSPEC":"D:\\Windows\\system32\\cmd.exe",
// 	"DEPLOYMENT_SOURCE":"C:\\DWASFiles\\Sites\\DeploymentScriptDemo\\VirtualDirectory0\\site\\repository",
// 	"DEPLOYMENT_TARGET":"C:\\DWASFiles\\Sites\\DeploymentScriptDemo\\VirtualDirectory0\\site\\wwwroot",
// 	"DEPLOYMENT_TEMP":"C:\\DWASFiles\\Sites\\DeploymentScriptDemo\\Temp\\89a585d1-ff6d-4c1e-b2b2-fc076659eac5",
// 	"EnableNuGetPackageRestore":"true",
// 	"FP_NO_HOST_CHECK":"NO",
// 	"HOMEDRIVE":"D:",
// 	"HOMEPATH":"\\",
// 	"KUDU_APPPATH":"C:\\DWASFiles\\Sites\\DeploymentScriptDemo\\VirtualDirectory0\\site",
// 	"KUDU_DEPLOYER":"justbe",
// 	"KUDU_EXE":"D:\\kuduservice\\wwwroot\\bin\\kudu.exe",
// 	"KUDU_MSBUILD":"D:\\kuduservice\\wwwroot\\msbuild",
// 	"LOCALAPPDATA":"C:\\DWASFiles\\Sites\\DeploymentScriptDemo\\LocalAppData",
// 	"MSBuildExtensionsPath32":"D:\\kuduservice\\wwwroot\\msbuild",
// 	"NUMBER_OF_PROCESSORS":"8",
// 	"OS":"Windows_NT",
// 	"PATH":"D:\\Program Files (x86)\\Git\\libexec\\git-core;D:\\Program Files (x86)\\Git\\bin;D:\\Program Files (x86)\\Git\\libexec\\git-core;D:\\Program Files (x86)\\Git\\bin;d:\\Windows\\system32;d:\\Windows;d:\\Windows\\System32\\Wbem;d:\\Windows\\System32\\WindowsPowerShell\\v1.0\\;d:\\Program Files (x86)\\Microsoft ASP.NET\\ASP.NET Web Pages\\v1.0\\;d:\\Users\\OnStartAdmin\\AppData\\Roaming\\npm;d:\\Program Files (x86)\\nodejs\\;.;D:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319;D:\\Program Files (x86)\\Git\\bin",
// 	"PATHEXT":".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC",
// 	"PROCESSOR_ARCHITECTURE":"x86",
// 	"PROCESSOR_ARCHITEW6432":"AMD64",
// 	"PROCESSOR_IDENTIFIER":"AMD64 Family 16 Model 8 Stepping 1, AuthenticAMD",
// 	"PROCESSOR_LEVEL":"16",
// 	"PROCESSOR_REVISION":"0801",
// 	"PROGRAMDATA":"C:\\DWASFiles\\Sites\\DeploymentScriptDemo\\ProgramData",
// 	"PROGRAMFILES":"D:\\Program Files (x86)",
// 	"PROGRAMFILES(X86)":"D:\\Program Files (x86)",
// 	"PROGRAMW6432":"D:\\Program Files",
// 	"PROMPT":"$P$G",
// 	"PSMODULEPATH":"D:\\Windows\\system32\\WindowsPowerShell\\v1.0\\Modules\\",
// 	"PUBLIC":"D:\\Users\\Public","PWD":"c:/DWASFiles/Sites/DeploymentScriptDemo/VirtualDirectory0/site/repository/.git",
// 	"Sdk40ToolsPath":"D:\\kuduservice\\wwwroot\\msbuild\\SDK\\v4.0",
// 	"SHLVL":"1",
// 	"SYSTEMDRIVE":"D:",
// 	"SYSTEMROOT":"D:\\Windows",
// 	"TEMP":"C:/DWASFiles/Sites/DeploymentScriptDemo/Temp",
// 	"TERM":"winansi",
// 	"TMP":"C:/DWASFiles/Sites/DeploymentScriptDemo/Temp",
// 	"TMPDIR":"C:/DWASFiles/Sites/DeploymentScriptDemo/Temp",
// 	"USERDOMAIN":"WORKGROUP",
// 	"USERNAME":"RD00155D440F9B$",
// 	"USERPROFILE":"C:\\DWASFiles\\Sites\\DeploymentScriptDemo\\UserProfile",
// 	"WINDIR":"D:\\Windows",
// 	"WINDOWS_TRACING_FLAGS":"",
// 	"WINDOWS_TRACING_LOGFILE":"",
// 	"_":"D:\\kuduservice\\wwwroot\\bin\\kudu.exe"
// }