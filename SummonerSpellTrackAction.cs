using StreamDeckLib;
using StreamDeckLib.Messages;
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Windows.Forms;

namespace LoLSpellTracker
{

	[ActionUuid(Uuid= "br.com.imfarias.lolspelltracker.SummonerSpellTrackAction")]
	public class SummonerSpellTrackAction : BaseStreamDeckActionWithSettingsModel<Models.CounterSettingsModel>
	{
		[STAThread]
		public override async Task OnKeyUp(StreamDeckEventPayload args)
		{
			string clipboard = "";

			Thread thread = new Thread(() => clipboard = Clipboard.GetText());
			thread.SetApartmentState(ApartmentState.STA); //Set the thread to STA
			thread.Start();
			thread.Join(); //Wait for the thread to end

			await Manager.SetTitleAsync(args.context, "Clipboard");
			byte[] bytesClipboard = System.Text.Encoding.UTF8.GetBytes(clipboard);
			string base64Text = System.Convert.ToBase64String(bytesClipboard);

			string encodedString = HttpUtility.UrlEncode(base64Text);

			await Manager.SetTitleAsync(args.context, Clipboard.GetText());
			Process.Start(new ProcessStartInfo
			{
				FileName = "https://ray.so?background=true&color=candy&darkMode=true&padding=32&language=\"auto\"&code=" + encodedString,
				UseShellExecute = true
			});

			thread = new Thread(() => Clipboard.SetText("https://ray.so?background=true&color=candy&darkMode=true&padding=32&language=\"auto\"&code=" + encodedString));
			thread.SetApartmentState(ApartmentState.STA); //Set the thread to STA
			thread.Start();
			thread.Join(); //Wait for the thread to end
		}

	}
}
