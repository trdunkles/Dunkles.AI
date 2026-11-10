/**
          >
            {chip}
          </button>
        ))}
        {error && <span className="text-xs text-red-400">{error}</span>}
        <span className="ms-auto hidden text-xs text-neutral-400 sm:block dark:text-neutral-500">
          Göndermek için Enter
        </span>
        <MetalFx
          variant="circle"
          preset={preset}
          theme={resolved}
          reflectionTargets={chipRefs}
          className={cn("inline-flex", !canSend && "opacity-70")}
        >
          <button
            type="button"
            aria-label="Gönder"
            disabled={!canSend}
            onClick={submit}
            className="flex size-9 items-center justify-center rounded-full text-neutral-900 transition-transform active:scale-95 disabled:cursor-not-allowed dark:text-white"
          >
            <ArrowUp className="size-4" />
          </button>
        </MetalFx>
      </div>
    </div>
  );
}

export default MetalPromptBar;
