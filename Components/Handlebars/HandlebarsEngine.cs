﻿using DotNetNuke.Web.Client;
using DotNetNuke.Web.Client.ClientResourceManagement;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using HandlebarsDotNet;
using DotNetNuke.UI.Modules;

namespace Satrabel.OpenContent.Components.Handlebars
{
    public class HandlebarsEngine
    {
        private int JSOrder = 100;
        public string Execute(string source, dynamic model)
        {
            var hbs = HandlebarsDotNet.Handlebars.Create();
            RegisterDivideHelper(hbs);
            RegisterMultiplyHelper(hbs);
            RegisterEqualHelper(hbs);
            RegisterArrayIndexHelper(hbs);
            RegisterArrayTranslateHelper(hbs);
            var template = hbs.Compile(source);
            var result = template(model);
            return result;
        }
        public string Execute(Page page, string sourceFilename, dynamic model)
        {
            string source = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath(sourceFilename));
            string sourceFolder = Path.GetDirectoryName(sourceFilename).Replace("\\", "/") + "/";
            var hbs = HandlebarsDotNet.Handlebars.Create();
            RegisterDivideHelper(hbs);
            RegisterMultiplyHelper(hbs);
            RegisterEqualHelper(hbs);
            RegisterScriptHelper(hbs);
            RegisterRegisterStylesheetHelper(hbs, page, sourceFolder);
            RegisterRegisterScriptHelper(hbs, page, sourceFolder);
            RegisterArrayIndexHelper(hbs);
            RegisterArrayTranslateHelper(hbs);
            var template = hbs.Compile(source);
            var result = template(model);
            return result;
        }
        public string Execute(Page page, IModuleControl module, string listFilename, string itemFilename, dynamic model)
        {
            string source = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath(listFilename));
            string sourceFolder = Path.GetDirectoryName(listFilename).Replace("\\", "/") + "/";
            var hbs = HandlebarsDotNet.Handlebars.Create();
            RegisterTemplate(hbs, itemFilename);
            RegisterDivideHelper(hbs);
            RegisterMultiplyHelper(hbs);
            RegisterEqualHelper(hbs);
            RegisterScriptHelper(hbs);
            RegisterRegisterStylesheetHelper(hbs, page, sourceFolder);
            RegisterRegisterScriptHelper(hbs, page, sourceFolder);
            //RegisterEditUrlHelper(hbs, module);
            RegisterArrayIndexHelper(hbs);
            RegisterArrayTranslateHelper(hbs);
            var template = hbs.Compile(source);
            var result = template(model);
            return result;
        }
        private void RegisterTemplate(HandlebarsDotNet.IHandlebars hbs, string sourceFilename)
        {
            string FileName = System.Web.Hosting.HostingEnvironment.MapPath(sourceFilename);
            using (var reader = new StreamReader(FileName))
            {
                var partialTemplate = hbs.Compile(reader);
                hbs.RegisterTemplate("item", partialTemplate);
            }
        }
        private void RegisterMultiplyHelper(HandlebarsDotNet.IHandlebars hbs)
        {
            hbs.RegisterHelper("multiply", (writer, context, parameters) =>
            {
                try
                {
                    int a = int.Parse(parameters[0].ToString());
                    int b = int.Parse(parameters[1].ToString());
                    int c = a * b;
                    HandlebarsDotNet.HandlebarsExtensions.WriteSafeString(writer, c.ToString());
                }
                catch (Exception)
                {
                    HandlebarsDotNet.HandlebarsExtensions.WriteSafeString(writer, "0");
                }
            });
        }
        private void RegisterDivideHelper(HandlebarsDotNet.IHandlebars hbs)
        {
            hbs.RegisterHelper("divide", (writer, context, parameters) =>
            {
                try
                {
                    int a = int.Parse(parameters[0].ToString());
                    int b = int.Parse(parameters[1].ToString());
                    int c = a / b;
                    HandlebarsDotNet.HandlebarsExtensions.WriteSafeString(writer, c.ToString());
                }
                catch (Exception)
                {
                    HandlebarsDotNet.HandlebarsExtensions.WriteSafeString(writer, "0");
                }
            });
        }
        private void RegisterEqualHelper(HandlebarsDotNet.IHandlebars hbs)
        {
            hbs.RegisterHelper("equal", (writer, options, context, arguments) =>
            {
                if (arguments.Length == 2 && arguments[0].Equals(arguments[1]))
                {
                    options.Template(writer, (object)context);
                }
                else
                {
                    options.Inverse(writer, (object)context);
                }
            });
        }
        private void RegisterScriptHelper(HandlebarsDotNet.IHandlebars hbs)
        {
            hbs.RegisterHelper("script", (writer, options, context, arguments) =>
            {
                HandlebarsDotNet.HandlebarsExtensions.WriteSafeString(writer, "<script>");
                options.Template(writer, (object)context);
                HandlebarsDotNet.HandlebarsExtensions.WriteSafeString(writer, "</script>");
            });
            
        }
        private void RegisterRegisterScriptHelper(HandlebarsDotNet.IHandlebars hbs, Page page, string sourceFolder)
        {
            hbs.RegisterHelper("registerscript", (writer, context, parameters) =>
            {
                if (parameters.Length == 1)
                {
                    string jsfilename = sourceFolder + parameters[0];
                    ClientResourceManager.RegisterScript(page, page.ResolveUrl(jsfilename), JSOrder++/*FileOrder.Js.DefaultPriority*/);
                    //writer.WriteSafeString(Page.ResolveUrl(jsfilename));
                }
            });
        }
        private void RegisterRegisterStylesheetHelper(HandlebarsDotNet.IHandlebars hbs, Page page, string sourceFolder)
        {
            hbs.RegisterHelper("registerstylesheet", (writer, context, parameters) =>
            {
                if (parameters.Length == 1)
                {
                    string cssfilename = parameters[0].ToString();
                    if (!cssfilename.Contains("/"))
                    {
                        cssfilename = sourceFolder + cssfilename;
                    }
                    ClientResourceManager.RegisterStyleSheet(page, page.ResolveUrl(cssfilename), FileOrder.Css.PortalCss);
                }
            });
        }
        private void RegisterEditUrlHelper(HandlebarsDotNet.IHandlebars hbs, IModuleControl module)
        {
            hbs.RegisterHelper("editurl", (writer, context, parameters) =>
            {
                if (parameters.Length == 1)
                {
                    string id = parameters[0] as string;
                    writer.WriteSafeString(module.ModuleContext.EditUrl("itemid",id));
                }
            });
        }

        private void RegisterArrayIndexHelper(HandlebarsDotNet.IHandlebars hbs)
        {
            hbs.RegisterHelper("arrayindex", (writer, context, parameters) =>
            {
                try
                {
                    object[] a;
                    if (parameters[0] is IEnumerable<Object>)
                    {
                        var en = parameters[0] as IEnumerable<Object>;
                        a = en.ToArray();
                    }
                    else 
                    {
                        a = (object[])parameters[0];
                    }
                    
                    
                    int b = int.Parse(parameters[1].ToString());
                    object c = a[b];
                    HandlebarsDotNet.HandlebarsExtensions.WriteSafeString(writer, c.ToString());
                }
                catch (Exception)
                {
                    HandlebarsDotNet.HandlebarsExtensions.WriteSafeString(writer, "");
                }
            });

        }

        private void RegisterArrayTranslateHelper(HandlebarsDotNet.IHandlebars hbs)
        {
            hbs.RegisterHelper("arraytranslate", (writer, context, parameters) =>
            {
                try
                {
                    object[] a;
                    if (parameters[0] is IEnumerable<Object>)
                    {
                        var en = parameters[0] as IEnumerable<Object>;
                        a = en.ToArray();
                    }
                    else
                    {
                        a = (object[])parameters[0];
                    }
                    object[] b;
                    if (parameters[1] is IEnumerable<Object>)
                    {
                        var en = parameters[1] as IEnumerable<Object>;
                        b = en.ToArray();
                    }
                    else
                    {
                        b = (object[])parameters[1];
                    }
                    string c = parameters[2].ToString();
                    int i = Array.IndexOf(a, c);

                    object res = b[i];
                    HandlebarsDotNet.HandlebarsExtensions.WriteSafeString(writer, res.ToString());
                }
                catch (Exception)
                {
                    HandlebarsDotNet.HandlebarsExtensions.WriteSafeString(writer, "");
                }
            });

        }
        
    }
}