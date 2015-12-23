﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Satrabel.OpenContent.Components.Lucene;
using Satrabel.OpenContent.Components.Manifest;

namespace Satrabel.OpenContent.Components.Infrastructure
{
    public class DefaultDatasource : IDatasource
    {
        public void GetData(TemplateInfo info, OpenContentSettings settings)
        {
            info.ResetData();

            OpenContentController ctrl = new OpenContentController();
            var struc = ctrl.GetFirstContent(info.ModuleId);
            if (struc != null)
            {
                info.SetData(struc.Json, settings.Data);
            }
        }

        public void GetDataList(TemplateInfo info, OpenContentSettings settings, bool clientSide)
        {
            info.ResetData();
            var ctrl = new OpenContentController();
            IEnumerable<OpenContentInfo> dataList;
            if (clientSide)
            {
                var data = ctrl.GetFirstContent(info.ModuleId);
                if (data != null)
                {
                    dataList = new List<OpenContentInfo>();
                    info.SetData(dataList, settings.Data);
                }
            }
            else
            {
                dataList = ctrl.GetContents(info.ModuleId);
                if (dataList.Any())
                {
                    info.SetData(dataList, settings.Data);
                }
            }
        }

        public void GetDetailData(TemplateInfo info, OpenContentSettings settings)
        {
            info.ResetData();
            OpenContentController ctrl = new OpenContentController();
            var struc = ctrl.GetContent(info.DetailItemId);
            if (struc != null && struc.ModuleId == info.ModuleId)
            {
                info.SetData(struc.Json, settings.Data);
            }
        }

        public bool GetDemoData(TemplateInfo info, OpenContentSettings settings)
        {
            info.ResetData();
            //bool settingsNeeded = false;
            FileUri dataFilename = null;
            if (info.Template != null)
            {
                dataFilename = new FileUri(info.Template.Uri().UrlFolder, "data.json"); ;
            }
            if (dataFilename != null && dataFilename.FileExists)
            {
                string fileContent = File.ReadAllText(dataFilename.PhysicalFilePath);
                string settingContent = "";
                if (!string.IsNullOrWhiteSpace(fileContent))
                {
                    if (settings.Template != null && info.Template.Uri().FilePath == settings.Template.Uri().FilePath)
                    {
                        settingContent = settings.Data;
                    }
                    if (string.IsNullOrEmpty(settingContent))
                    {
                        var settingsFilename = info.Template.Uri().PhysicalFullDirectory + "\\" + info.Template.Key.ShortKey + "-data.json";
                        if (File.Exists(settingsFilename))
                        {
                            settingContent = File.ReadAllText(settingsFilename);
                        }
                        else
                        {
                            //string schemaFilename = info.Template.Uri().PhysicalFullDirectory + "\\" + info.Template.Key.ShortKey + "-schema.json";
                            //settingsNeeded = File.Exists(schemaFilename);
                        }
                    }
                }
                if (!string.IsNullOrWhiteSpace(fileContent))
                    info.SetData(fileContent, settingContent);
            }
            return !info.ShowInitControl; //!string.IsNullOrWhiteSpace(info.DataJson) && (!string.IsNullOrWhiteSpace(info.SettingsJson) || !settingsNeeded);
        }

        internal bool GetOtherModuleDemoData(TemplateInfo _info, TemplateInfo info, OpenContentSettings settings)
        {
            _info.ResetData();
            var ctrl = new OpenContentController();
            var struc = ctrl.GetFirstContent(info.ModuleId);
            if (struc != null)
            {
                if (settings.Template != null && info.Template.Uri().FilePath == settings.Template.Uri().FilePath)
                {
                    _info.SetData(struc.Json, settings.Data);
                }
                if (string.IsNullOrEmpty(info.SettingsJson))
                {
                    var settingsFilename = info.Template.Uri().PhysicalFullDirectory + "\\" + info.Template.Key.ShortKey + "-data.json";
                    if (File.Exists(settingsFilename))
                    {
                        string settingsContent = File.ReadAllText(settingsFilename);
                        if (!string.IsNullOrWhiteSpace(settingsContent))
                        {
                            _info.SetData(struc.Json, settingsContent);
                        }
                    }
                }
                //Als er OtherModuleSettingsJson bestaan en 
                if (_info.OtherModuleTemplate.Uri().FilePath == _info.Template.Uri().FilePath && !string.IsNullOrEmpty(_info.OtherModuleSettingsJson))
                {
                    _info.SetData(struc.Json, _info.OtherModuleSettingsJson);
                }

                return true;
            }
            return false;
        }

    }
}