using System;
using System.Collections.Generic;
using System.Text;

namespace LoLSpellTracker.models
{
    class PlayerDTO
    {
        public string championName { get; set; }
        public string summonerName { get; set; }
        public string team { get; set; }
        public SummonerSpellList summonerSpells { get; set; }
    }
}
